use juniper::{EmptySubscription, RootNode};
use mongodb::bson::doc;

use crate::graphql::types::{
    LikeAndDislikeResult, LikeInfo, LikeServiceQueryReturn, Likes, LikesByObjectIdResult,
};

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
    async fn LikesByObjectId(
        &self,
        context: &ContextUtil,
        object_id: String,
    ) -> Result<LikesByObjectIdResult, CustomError> {
        let user_session = context.is_authentication();
        let likes = context
            .likes_collection
            .find_one(
                doc! {
                    "object_id":object_id.clone()
                },
                None,
            )
            .await
            .unwrap();
        if let None = likes {
            return Err(CustomError::NotFound);
        }
        let mut my_like_info = None;
        if let Some(session) = user_session.await {
            if let Some(like_info) = context
                .like_info_collection
                .find_one(
                    doc! {
                        "object_id":object_id.clone(),
                        "user_id" : session.user_id.clone(),
                    },
                    None,
                )
                .await
                .unwrap()
            {
                my_like_info = Some(like_info.to_like_info_result());
            } else {
                return Err(CustomError::NotFound);
            }
        };
        return Ok(LikesByObjectIdResult {
            likes: likes.unwrap().to_likes_result(),
            my_like_info: my_like_info,
        });
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
    ) -> Result<LikeAndDislikeResult, CustomError> {
        let user_session = if let Some(s) = context.is_authentication().await {
            s
        } else {
            return Err(CustomError::Unauthorized);
        };
        let id_real = context
            .is_id_real(input.object_id.clone(), input.type_obj.clone())
            .await;
        if !id_real {
            return Err(CustomError::InvalidId);
        }

        let object_id = input.object_id.clone();
        let like_doc = match context
            .likes_collection
            .find_one(doc! {"object_id": object_id.clone()}, None)
            .await
            .unwrap()
        {
            Some(likes) => likes.id,
            None => context
                .likes_collection
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

        let mut like_add = 0;
        let like_info_doc = match context
            .like_info_collection
            .find_one(
                doc! {"object_id":object_id.clone(),"user_id":user_session.user_id.clone()},
                None,
            )
            .await
            .unwrap()
        {
            Some(like_info) => {
                let mut like_info_like_number = 0;
                if like_info.like_number <= -1 {
                    // if dislike and then like set like to WasReaction
                    like_info_like_number = 0;
                } else if like_info.like_number >= 1 {
                    like_info_like_number = 1;
                    // skip
                } else if like_info.like_number == 0 {
                    // if wasReaction we change to like
                    like_add = 1;
                    like_info_like_number = 1;
                }
                context
                    .like_info_collection
                    .find_one_and_update(
                        doc! {
                            "_id":like_info.id
                        },
                        doc! {
                            "like_number":like_info_like_number
                        },
                        None,
                    )
                    .await
                    .unwrap()
                    .unwrap()
                    .id
            }
            None => context
                .like_info_collection
                .insert_one(
                    LikeInfo {
                        user_id: user_session.user_id.clone(),
                        id: mongodb::bson::oid::ObjectId::new(),
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
        let result = context
            .likes_collection
            .find_one_and_update(
                doc! {"_id":like_doc},
                doc! {"$push":doc!{
                    "$inc":doc! {
                        "number_of_like":like_add
                    },
                "like_info_ids": like_info_doc
                }},
                None,
            )
            .await
            .unwrap()
            .unwrap();

        Ok(LikeAndDislikeResult {
            likes: result.to_likes_result(),
            like_info: context
                .like_info_collection
                .find_one(doc! {"_id":like_info_doc}, None)
                .await
                .unwrap()
                .unwrap()
                .to_like_info_result(),
        })
    }

    async fn dislike<'ctx>(
        &self,
        context: &ContextUtil,
        input: LikeMutationInput,
    ) -> Result<LikeAndDislikeResult, CustomError> {
        let user_session = if let Some(s) = context.is_authentication().await {
            s
        } else {
            return Err(CustomError::Unauthorized);
        };
        let id_real = context
            .is_id_real(input.object_id.clone(), input.type_obj.clone())
            .await;
        if !id_real {
            return Err(CustomError::InvalidId);
        }
        let object_id = input.object_id.clone();
        let like_doc = match context
            .likes_collection
            .find_one(doc! {"object_id": object_id.clone()}, None)
            .await
            .unwrap()
        {
            Some(likes) => likes.id,
            None => context
                .likes_collection
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
        let mut like_add = 0;
        let like_info_doc = match context
            .like_info_collection
            .find_one(
                doc! {"object_id":object_id.clone(),"user_id":user_session.user_id.clone()},
                None,
            )
            .await
            .unwrap()
        {
            Some(like_info) => {
                let mut like_info_like_number = 0;
                if like_info.like_number <= -1 {
                    // if dislike and then dislike we skip
                } else if like_info.like_number >= 1 {
                    // then we set to wasReaction
                    like_info_like_number = 0;
                    like_add = -1;
                } else if like_info.like_number == 0 {
                    // if wasReaction we change to dislike
                    like_add = -1;
                    like_info_like_number = -1;
                }
                context
                    .like_info_collection
                    .find_one_and_update(
                        doc! {
                            "_id":like_info.id
                        },
                        doc! {
                            "like_number":like_info_like_number
                        },
                        None,
                    )
                    .await
                    .unwrap()
                    .unwrap()
                    .id
            }
            None => context
                .like_info_collection
                .insert_one(
                    LikeInfo {
                        user_id: user_session.user_id.clone(),
                        id: mongodb::bson::oid::ObjectId::new(),
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
        let result = context
            .likes_collection
            .find_one_and_update(
                doc! {"_id":like_doc},
                doc! {"$push":doc!{
                    "$inc":doc! {
                        "number_of_like":like_add
                    },
                "like_info_ids": like_info_doc
                }},
                None,
            )
            .await
            .unwrap()
            .unwrap();

        Ok(LikeAndDislikeResult {
            likes: result.to_likes_result(),
            like_info: context
                .like_info_collection
                .find_one(doc! {"_id":like_info_doc}, None)
                .await
                .unwrap()
                .unwrap()
                .to_like_info_result(),
        })
    }
}

pub type GraphqlSchema = RootNode<'static, QueryRoot, MutationRoot, EmptySubscription<ContextUtil>>;

pub fn schema() -> GraphqlSchema {
    GraphqlSchema::new(QueryRoot, MutationRoot, EmptySubscription::default())
}
