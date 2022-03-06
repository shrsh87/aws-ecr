"""
https://www.pulumi.com/blog/build-publish-containers-iac/
https://velog.io/@klasis/Windows-10%EC%97%90%EC%84%9C-Docker-for-Windows-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0
"""
import base64
import pulumi
import pulumi_aws as aws
import pulumi_docker as docker

# Create a private ECR repository.
my_repo = aws.ecr.Repository("demo-nodejs-mariadb",
    image_scanning_configuration=aws.ecr.RepositoryImageScanningConfigurationArgs(
        scan_on_push=True,
    ),
    image_tag_mutability="MUTABLE")

## Get registry info (creds and endpoint).
def getRegistryInfo(rid):
    creds = aws.ecr.get_credentials(registry_id=rid)
    decoded = base64.b64decode(creds.authorization_token).decode()
    parts = decoded.split(':')
    if len(parts) != 2:
        raise Exception("Invalid credentials")
    return docker.ImageRegistry(creds.proxy_endpoint, parts[0], parts[1])
image_name = my_repo.repository_url
registry_info = my_repo.registry_id.apply(getRegistryInfo)
#registry_info = None # use ECR credentials helper.

# Build and publish the container image.
image = docker.Image('my-image',
    build='./app',
    # build=docker.DockerBuild(
    #     context=None, 
    #     dockerfile='./app', 
    #     cache_from=None, 
    #     env=None, 
    #     target='dependencies', 
    #     args={'parameter': str(1)}),
    image_name=image_name,
    registry=registry_info,
)

# Export the base and specific version image name.
pulumi.export('baseImageName', image.base_image_name)
pulumi.export('fullImageName', image.image_name)