# read data
library(ggplot2)
library(fpc)
df<-read.csv("D:/xiaoqu.csv")

#小区的经纬度作为地理聚类的feature
m=as.matrix(cbind(df$lat,df$lng),ncol=2)


cl=(kmeans(m,5))
cl$size
cl$withinss

df$cluster=factor(cl$cluster)
centers=as.data.frame(cl$centers)

ggplot(data=df, aes(x=lat, y=lng, color=cluster )) + 
  geom_point() + 
  geom_point(data=centers, aes(x=V1,y=V2, color='Center')) + 
  geom_point(data=centers, aes(x=V1,y=V2, color='Center'), size=30, alpha=.3,show.legend=FALSE)
