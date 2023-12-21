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
    NotFound,
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
            CustomError::NotFound => FieldError::new(
                "Not found",
                graphql_value!({
                    "type":"NotFound",
                    "message":"Not found"
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
    pub number_of_like: i32,
    pub object_type: String,
    pub like_info_ids: Vec<String>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize, GraphQLObject)]
pub struct LikeResult {
    #[serde(rename = "_id")]
    #[graphql(name = "_id")]
    pub id: String,
    pub object_id: String,
    pub number_of_like: i32,
    pub object_type: String,
    pub like_info_ids: Vec<String>,
}
impl Likes {
    pub fn to_likes_result(&self) -> LikeResult {
        return LikeResult {
            id: self.id.to_hex(),
            object_id: self.object_id.to_string(),
            number_of_like: self.number_of_like,
            object_type: self.object_type.to_string(),
            like_info_ids: self.like_info_ids.clone(),
        };
    }
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct LikeInfo {
    #[serde(rename = "_id")]
    pub id: mongodb::bson::oid::ObjectId,
    pub user_id: String,
    pub object_id: String,
    pub like_number: i8, // like 1 if like , 0 if WasReaction , -1 if dislike
    pub likes_id: String,
}

#[derive(Debug, serde::Deserialize, serde::Serialize, GraphQLObject)]
pub struct LikeInfoResult {
    #[serde(rename = "_id")]
    #[graphql(name = "_id")]
    pub id: String,
    pub user_id: String,
    pub object_id: String,
    // like 1 if like , 0 if WasReaction , -1 if dislike
    pub like_number: i32,
    pub likes_id: String,
}
impl LikeInfo {
    pub fn to_like_info_result(&self) -> LikeInfoResult {
        return LikeInfoResult {
            id: self.id.to_hex(),
            user_id: self.user_id.to_string(),
            object_id: self.object_id.clone(),
            like_number: self.like_number.try_into().unwrap(),
            likes_id: self.likes_id.clone(),
        };
    }
}

#[derive(Debug, GraphQLObject, serde::Deserialize, serde::Serialize)]
pub struct LikesByObjectIdResult {
    pub likes: LikeResult,
    pub my_like_info: Option<LikeInfoResult>,
}

#[derive(Debug, GraphQLObject, serde::Deserialize, serde::Serialize)]
pub struct LikeAndDislikeResult {
    pub likes: LikeResult,
    pub like_info: LikeInfoResult,
}
