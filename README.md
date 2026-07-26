# GitHub-Actions-CI-CD-pipeline
End-to-end CI/CD pipeline utilizing Docker for containerization, SonarQube for code quality, Trivy for vulnerability scanning, and AWS for automated deployment.


A production-inspired DevOps project demonstrating modern CI/CD practices using **GitHub Actions**, **Docker**, **AWS ECS Fargate**, **Amazon ECR**, **Application Load Balancer**,  **Trivy**, and **SonarCloud**.

This project showcases how a full-stack application can be automatically tested, analyzed, containerized, scanned, pushed to Amazon ECR, and deployed to AWS ECS using GitHub Actions with **OIDC authentication** (no long-lived AWS credentials).

---

## Architecture

```
Developer
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions CI Pipeline
 ├── Checkout Code
 ├── Install Dependencies
 ├── Run Unit Tests
 ├── SonarCloud Analysis
 ├── Trivy Security Scan
 ├── Build Docker Image
 └── Push Image to Amazon ECR
    │
    ▼
GitHub Actions CD Pipeline
 ├── Assume AWS Role (OIDC)
 ├── Update ECS Task Definition
 ├── Deploy to ECS Fargate
 ├── Wait for Stable Deployment
 └── Smoke Test
    │
    ▼
Application Load Balancer
    │
    ▼
Amazon ECS Fargate
    │
    ▼
Node.js Backend + React Frontend
```

# Snapshots

## Github Actions:
<img width="1906" height="852" alt="cicd gha" src="https://github.com/user-attachments/assets/6ecc2903-7341-4863-b873-c8820f51580e" />
<img width="1905" height="965" alt="ci workflow" src="https://github.com/user-attachments/assets/ff45e3b2-2d58-4727-9fec-fd97837c4403" />
<img width="1910" height="947" alt="ci workflow 1 " src="https://github.com/user-attachments/assets/36718943-b959-4c4f-8589-e79c56622091" />
<img width="1896" height="945" alt="cd wf" src="https://github.com/user-attachments/assets/2c0b3573-ea1f-4de1-8982-c713b029f9ae" />
## Docker Hub:
<img width="1882" height="932" alt="docker hub" src="https://github.com/user-attachments/assets/9fc6bbe9-e06a-4035-aee1-fc0968be7b1c" />
## Sonarqube Analysis:
<img width="1917" height="907" alt="sonarqube" src="https://github.com/user-attachments/assets/409a9a6c-80ee-40e6-ab88-916b36bd8004" />
## Trivy scan results:
<img width="1877" height="890" alt="trivy scan" src="https://github.com/user-attachments/assets/5720034d-a385-4f2e-8549-2858d4bb322b" />
## AWS ECS Cluster:
<img width="1912" height="910" alt="ecs" src="https://github.com/user-attachments/assets/301bd762-2a94-4e3a-809f-de760687b858" />
<img width="1881" height="862" alt="td ecs" src="https://github.com/user-attachments/assets/beb9e02f-d833-4897-b655-8e4ede63fa35" />
## ECR:
<img width="1891" height="837" alt="ecr" src="https://github.com/user-attachments/assets/ceee8cf2-c4ab-4f0d-8a55-5a771315f706" />
## ALB:
<img width="1877" height="925" alt="alb" src="https://github.com/user-attachments/assets/0e33697d-6e08-458b-9255-8b5fc81fc018" />
## Deployed Application Frontend:
<img width="590" height="1108" alt="IMG-20260726-WA0005" src="https://github.com/user-attachments/assets/bf3b9269-903e-429f-9c3f-11b3b7b04118" />




---

# Features

- Full-stack Todo application
- React frontend
- Node.js + Express backend
- Docker multi-stage builds
- GitHub Actions CI/CD
- SonarCloud code quality analysis
- Trivy container vulnerability scanning
- Amazon ECR image registry
- ECS Fargate deployment
- Application Load Balancer
- GitHub OIDC authentication with AWS IAM Role
- Zero AWS Access Keys stored in GitHub Secrets
- Automated deployment after successful CI
- Health checks and deployment validation

---

# 🛠 Tech Stack

## Frontend

- React
- Vite

## Backend

- Node.js
- Express

## DevOps

- Docker
- GitHub Actions
- AWS ECS Fargate
- Amazon ECR
- Application Load Balancer
- IAM
- OIDC
- Trivy
- SonarCloud


---

# CI Pipeline

The Continuous Integration workflow automatically executes on every Push and Pull Request.

### CI Stages

- Checkout source code
- Install dependencies
- Run frontend tests
- Run backend tests
- Build React application
- Build Docker image
- SonarCloud code analysis
- Trivy vulnerability scan
- Push Docker image to Amazon ECR

---

# CD Pipeline

The deployment workflow is triggered after the CI pipeline completes successfully.

### CD Stages

- Configure AWS credentials using OIDC
- Authenticate with Amazon ECR
- Render ECS task definition
- Deploy new task definition
- Wait until ECS service becomes stable
- Execute smoke test

---

# Security

This project follows several production security best practices.

- GitHub OIDC authentication
- No AWS Access Keys stored in GitHub
- Least Privilege IAM Policies
- Trivy image vulnerability scanning
- SonarCloud static code analysis
- Non-root Docker container
- Multi-stage Docker build

---



# ☁ AWS Services Used

- Amazon ECS
- Amazon ECR
- Application Load Balancer
- IAM
- CloudWatch Logs
- VPC
- Security Groups

---

# 🔄 CI/CD Workflow

```
Developer
      │
      ▼
Git Push
      │
      ▼
GitHub Actions (CI)
      │
      ├── Tests
      ├── SonarCloud
      ├── Trivy
      ├── Docker Build
      └── Push to Amazon ECR
      │
      ▼
GitHub Actions (CD)
      │
      ▼
Amazon ECS Fargate
      │
      ▼
Application Load Balancer
      │
      ▼
Live Application
```



