use async_graphql::{EmptyMutation, EmptySubscription, Schema};

pub(crate) mod schema;

pub type RootSchema = Schema<schema::query::RootQuery, EmptyMutation, EmptySubscription>;
