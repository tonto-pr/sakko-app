pipeline {
    environment {
        registryCredential = 'dockerhub'
        dockerImage = "antoinert/tonto"
    }
    agent any
    stages {
        stage('Build') {
            steps {
                script {
                    sh 'yarn install'
                    sh 'yarn build'
                }
            }
        }
    }
}
