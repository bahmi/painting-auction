# Painting Auction

Backend services for an auctioning platform following the Microservices architecture using the Serverless Framework.

## Background

NFTs have taken the planet by storm. After being sold for an astounding $91.8 million, the Merge officially became the most expensive NFT ever.

NFTs are auctioned off in a variety of marketplaces, including OpenSea and Rarible. The seller establishes a minimum price for a certain time period in an NFT auction. Buyers can bid as much they wish for the NFT as long as it is greater than the minimum price. Following that, at the end of the selling time, the NFT is sold to the highest bidder. \
I wanted to implement this vital feature, but in a scalable way for traditional paintings. A cloud-hosted solution appears to be an ideal contender for this.

In the cloud, both Kubernetes and serverless are sweeping the industry. In this project, we will look at the AWS serverless services that can be used to build a scalable solution. The logical follow-up question is why not use Kubernetes instead of serverless. Well, after working with startups for several years where resources are scarce, I believe serverless is more feasible than Kubernetes because it is easier to get started, requires minimal administration, autoscaling, and is pay per usage, which is crucial in startup environments. \
All of these advantages, however, do not imply that serverless systems are without limits. We'll look at those limitations and shortcomings, and figure out how to overcome them.

## AWS Services

The following is a list of the AWS services that were utilized.

- API Gateway
- CloudFormation
- CloudWatch
- DynamoDB
- EventBridge
- IAM
- Lambda
- S3
- SES
- SQS

## Features

- Authentication and Authorization
- Data validation and error handling
- Data persistence
- Email notifications
- Message Queues for cross-service communication
- REST API and CRUD endpoints
- Cloud-based object storage
- Scheduled event triggers

## Overview

![painting-auction](https://i.ibb.co/Q6bXDDC/Painting-Auction.png)

## Built With

- [Amazon Web Services](https://aws.amazon.com/) - Cloud provider
- [Serverless](https://www.serverless.com/) - Web framework
- [Node.js](https://nodejs.org/en/) - Server-side runtime environment
- [GitHub Actions](https://github.com/features/actions) - CI/CD pipeline
- [Auth0](https://auth0.com/) - Authentication platform
- [VSCode](https://code.visualstudio.com/) - Code editor
- [Postman](https://www.postman.com/) - API management
