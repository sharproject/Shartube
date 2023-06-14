use juniper::{EmptySubscription, RootNode};

use crate::graphql::types::LikeServiceQueryReturn;

use super::{
    context::ContextUtil,
    types::{CustomError, LikeMutationInput},
};

pub struct QueryRoot;

#[juniper::graphql_object(
    Context = ContextUtil
)]
impl QueryRoot {
    async fn api_version(&self) -> &'static str {
        "1.0.0"
    }
    #[graphql(name = "_service")]
    fn _service(&self, context: &ContextUtil) -> LikeServiceQueryReturn {
        return LikeServiceQueryReturn {
            sdl: context.sdl.clone(),
        };
    }
}

pub struct MutationRoot;

#[juniper::graphql_object(
    Context = ContextUtil
)]
impl MutationRoot {
    // need auth
    async fn like<'ctx>(
        &self,
        context: &ContextUtil,
        input: LikeMutationInput,
    ) -> Result<String, CustomError> {
        let user_session = if let Some(s) = context.is_authentication() {
            s
        } else {
            return Err(CustomError::Unauthorized);
        };
        Ok("".to_string())
    }
}

pub type GraphqlSchema = RootNode<'static, QueryRoot, MutationRoot, EmptySubscription<ContextUtil>>;

pub fn schema() -> GraphqlSchema {
    GraphqlSchema::new(QueryRoot, MutationRoot, EmptySubscription::default())
}
