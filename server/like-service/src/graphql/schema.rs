use juniper::{EmptySubscription, RootNode};
use mongodb::{bson::doc, options::UpdateOptions};

use crate::graphql::types::{LikeAction, LikeInfo, LikeServiceQueryReturn, Likes};

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
const LIKES_COLECTION_NAME: &'static str = "likes";
const LIKE_INFO_COLECTION_NAME: &'static str = "like_info";
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
        let id_real = context.is_id_real(input.object_id.clone(), input.type_obj.clone());
        if !id_real {
            return Err(CustomError::InvalidId);
        }
        let likes_colection = context.db.collection::<Likes>(LIKES_COLECTION_NAME);
        let object_id = input.object_id.clone();
        let like_doc = match likes_colection
            .find_one(doc! {"object_id": object_id.clone()}, None)
            .await
            .unwrap()
        {
            Some(likes) => likes.id,
            None => likes_colection
                .insert_one(
                    Likes {
                        id: mongodb::bson::oid::ObjectId::new(),
                        object_id: object_id.clone(),
                        number_of_like: 1,
                        object_type: input.type_obj.clone(),
                        like_info_ids: vec![],
                    },
                    None,
                )
                .await
                .unwrap()
                .inserted_id
                .as_object_id()
                .unwrap(),
        };
        let like_info_colection = context.db.collection::<LikeInfo>(LIKE_INFO_COLECTION_NAME);
        let like_info_doc = match like_info_colection
            .find_one(
                doc! {"object_id":object_id.clone(),"user_id":user_session.user_id.clone()},
                None,
            )
            .await
            .unwrap()
        {
            Some(like_info) => like_info.id,
            None => like_info_colection
                .insert_one(
                    LikeInfo {
                        user_id: user_session.user_id.clone(),
                        id: mongodb::bson::oid::ObjectId::new(),
                        action: LikeAction::Like,
                        like_number: 1,
                        likes_id: like_doc.to_hex(),
                        object_id: object_id.clone(),
                    },
                    None,
                )
                .await
                .unwrap()
                .inserted_id
                .as_object_id()
                .unwrap(),
        };
        likes_colection.find_one_and_update(
            doc! {"_id":like_doc},
            doc! {"$push":doc!{
            "like_info_ids": like_info_doc
            }},
            None,
        );

        Ok("".to_string())
    }
}

pub type GraphqlSchema = RootNode<'static, QueryRoot, MutationRoot, EmptySubscription<ContextUtil>>;

pub fn schema() -> GraphqlSchema {
    GraphqlSchema::new(QueryRoot, MutationRoot, EmptySubscription::default())
}
