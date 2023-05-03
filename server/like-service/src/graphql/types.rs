use juniper::{FieldError, IntoFieldError, ScalarValue};

#[derive(GraphQLInputObject)]
pub struct LikeMutationInput {
    #[graphql(
        name = "type",
        description = "type of object like comic, short_comic, comic_session, comic_chap, short_comic_chap"
    )]
    type_obj: String,
    object_id: String,
}

#[derive(GraphQLObject)]
pub struct LikeServiceQueryReturn {
    pub sdl: String,
}

pub enum CustomError {
    Unauthorized,
}

impl<S: ScalarValue> IntoFieldError<S> for CustomError {
    fn into_field_error(self) -> FieldError<S> {
        match self {
            CustomError::Unauthorized => FieldError::new(
                "You are not authorized to access this resource",
                graphql_value!({
                    "type": "Unauthorized",
                    "message":"You are not authorized to access this resource"
                }),
            ),
        }
    }
}
