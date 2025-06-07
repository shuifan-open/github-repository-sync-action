# release tag名称
releaseTagName=v2
# 当前tag名称
currentTagName=v2.0.2
# 删除本地release tag
git tag -d $releaseTagName
# 删除远程release tag
git push origin --delete $releaseTagName
# 删除本地current tag
git tag -d $currentTagName
# 删除远程current tag
git push origin --delete $currentTagName
# 将当前分支打成tag
git tag $currentTagName
# 将当前分支打成release tag
git tag -a $releaseTagName -m "release $releaseTagName"
# tag提交
git push origin $currentTagName
git push origin $releaseTagName
