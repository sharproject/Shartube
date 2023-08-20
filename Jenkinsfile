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
                echo 'Setup env success'
            }
        }
        stage('Login docker'){
            environment {
                DOCKER_LOGIN_INFO = credentials("ShartubeImageToken")
            }
            steps {
                sh "echo $DOCKER_LOGIN_INFO_PSW | docker login -u $DOCKER_LOGIN_INFO_USR --password-stdin"
                echo 'Login Completed'
            }
            
        }
        stage('Build Docker Image') {
            steps {
                sh "cd server/ && docker compose build"
                echo 'Docker-compose-build Build Image Completed'
            }
        }
        stage("Push Docker Image"){
            steps {
                sh "pwd"
                sh "docker compose push"
                echo 'Docker-compose-push Push Image Completed'
            }
        }
    }
}
