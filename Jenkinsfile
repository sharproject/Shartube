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
