use juniper::{FieldError, IntoFieldError, ScalarValue};

#[derive(GraphQLInputObject)]
pub struct LikeMutationInput {
    #[graphql(
        name = "type",
        description = "type of object like comic, short_comic, comic_session, comic_chap, short_comic_chap"
    )]
    pub type_obj: String,
    pub object_id: String,
}

#[derive(GraphQLObject)]
pub struct LikeServiceQueryReturn {
    pub sdl: String,
}

pub enum CustomError {
    Unauthorized,
    InvalidId,
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
            CustomError::InvalidId => FieldError::new(
                "Your input id invalid",
                graphql_value!({
                    "type":"InvalidId",
                    "message":"Your input id invalid"
                }),
            ),
        }
    }
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Likes {
    #[serde(rename = "_id")]
    pub id: mongodb::bson::oid::ObjectId,
    pub object_id: String,
    pub number_of_like: u128,
    pub object_type: String,
    pub like_info_ids: Vec<String>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub enum LikeAction {
    Like,
    DisLike,
    WasReaction,
}
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct LikeInfo {
    #[serde(rename = "_id")]
    pub id: mongodb::bson::oid::ObjectId,
    pub user_id: String,
    pub action: LikeAction,
    pub object_id: String,
    pub like_number: i8, // like 1 if like , 0 if WasReaction , -1 if dislike
    pub likes_id: String,
}
