# read data
sh<-read.csv("D:/xiaoqu.csv")

# extraxt training dataset and test dataset
train_ds<-sh[1:38,c(7,8,11,4,9,3)]
test_ds<-sh[39:40,c(7,8,11,4,9,3)]
attach(train_ds)

##########################################
## Model: 多元线性回归
##########################################

#所有关系的散点图
plot(train_ds)
attach(train_ds)

# 1. calculate the correlation
cor(train_ds)
cor.test(avg_price,lat)  
cor.test(avg_price,lng)  
cor.test(avg_price,house_count)  
cor.test(avg_price,selling_count)  
cor.test(avg_price,community_age) 


# 2. Multi-var linear regression
# Model 1: 5 vars
reg1=lm(avg_price~lat+lng+house_count+selling_count+community_age)
summary(reg1)
# Model 2: 4 vars
reg2=lm(avg_price~lat+lng+house_count+selling_count)
summary(reg2)
# Model 3: 3 vars
reg3=lm(avg_price~lat+lng+selling_count)
summary(reg3)

# 3. Model Interpretation
aa=coefficients(reg3)
a0=aa[[1]]
a1=aa[[2]]
a2=aa[[3]]
a4=aa[[4]]


attach(test_ds)
# model prediction for 39:40
y2=a0+a1*lat+a2*lng+a4*selling_count



# 4. Prediction
# predict year: 2011:2012
# result: 61391.81 56655.87
y2_rs=a0+a1*lat+a2*lng+a4*selling_count

# community A:58552.91
y2_A = a0+a1*31.2+a2*121.4+a4*10

# community B: 65359.83
y2_B = a0+a1*31.25+a2*121.5+a4*10

# 5. Model accurancy
# error:0.175894
error2<-mean((test_ds$avg_price - y2_rs)/test_ds$avg_price)