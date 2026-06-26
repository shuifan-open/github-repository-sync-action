# release tag名称
releaseTagName=v3
# 当前tag名称
currentTagName=v3.0.0
# 当前目录
echo $(pwd)
# 将当前分支打成tag
git tag -f $currentTagName
# 将当前分支打成release tag
git tag -f -a $releaseTagName -m "release $releaseTagName"
# tag提交
git push --tags -f
