pipeline {
    agent {
        label 'linux'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup env'){
            steps {
                sh "cp server/.base.env.example server/.base.env"
                sh "cp server/comic/.env.example server/comic/.env"
                sh "cp server/cdn-service/.env.example server/cdn-service/.env"
                sh "touch server/graphql-gateway/.env"
            }
        }
        stage('Build and Push Docker Image') {
            steps {
                sh "cd server/ && docker compose build && docker compose push"
            }
        }

        stage('Verify') {
            steps {
                sh 'echo $REGISTRY_BUILD_OUTPUT_DIGEST'
            }
        }
    }
}
