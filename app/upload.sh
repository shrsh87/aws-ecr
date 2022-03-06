#1. aws configure 셋팅
#[telco@ds7 aws_eks_mariadb]$ aws configure list
#      Name                    Value             Type    Location
#      ----                    -----             ----    --------
#   profile                <not set>             None    None
#access_key     ****************A3R3 shared-credentials-file   
#secret_key     ****************itcE shared-credentials-file   
#    region           ap-northeast-2      config-file    ~/.aws/config
 
 
#2. image repository 생성
 
aws ecr create-repository \
  --repository-name demo-nodejs-mariadb \
  --image-scanning-configuration scanOnPush=true \
  --region ap-northeast-2
 
#3. docker image (login - bulid - tag - push)
 
# login
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com
 
# build image
docker build -t demo-nodejs-mariadb .
 
# tagging image
docker tag demo-nodejs-mariadb:latest $ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/demo-nodejs-mariadb:latest
 
# push image to the aws ecr repository
docker push $ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/demo-nodejs-mariadb:latest
