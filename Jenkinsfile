pipeline {
    agent {
        label 'docker'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup env'){
            steps {
                dir("./server/") {
                    sh "cp .base.env.example .base.env"
                    dir("./comic/") {
                        sh "cp .env.example .env"
                    }
                    dir("./cdn-service/") {
                        sh "cp .env.example .env"
                    }
                    dir("graphql-gateway") {
                        sh "touch .env"
                    }
                }
                
                echo 'Setup env success'
            }
        }
        stage('Login docker'){
            environment {
                DOCKER_LOGIN_INFO = credentials("ShartubeImageToken")
            }
            steps {
                sh ('echo $DOCKER_LOGIN_INFO_PSW | docker login -u $DOCKER_LOGIN_INFO_USR --password-stdin')
                echo 'Login Completed'
            }
            
        }
        stage('Build Docker Image') {
            steps {
                dir("./server/") {
                    sh "docker compose build"
                }
                echo 'Docker-compose-build Build Image Completed'
            }
        }
        stage("Push Docker Image"){
            steps {
                dir("./server/") {
                    sh "docker compose push"
                }
                echo 'Docker-compose-push Push Image Completed'
            }
        }
    }
    post {
        always { 
            sh "docker logout"
        }
        success {
            agent {
                label 'vps4'
            }
            dir("/home/toby/code-ga/Shartube/docker-compose") {
                sh "git pull"
                sh "export PORT=8081"
                sh "sudo su"
                sh "docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --pull always"
            }
            
        }
    }
}
