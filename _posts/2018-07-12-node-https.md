---
layout:     post
title:      "node 部署 https 服务总结"
date:       "2018-07-12"
author:     "XuBaoshi"
header-img: "img/node-module.jpg"
---

# node 部署 https 服务总结

因做小程序开发，后端服务使用 node 搭建， 但小程序要求后端服务必须支持 https ，故搭建过程总结如下：

## 域名购买

域名购买的渠道很多， 本人在 [阿里云](https://wanwang.aliyun.com/) 上购买，购买后需要提交实名验证审核后才可以正常使用。  
  
![/img/node-https/1.jpg](/img/node-https/1.jpg)  

点击操作右侧解析链接配置改域名对应的解析地址。  
  
![/img/node-https/2.jpg](/img/node-https/2.jpg)  

配置好后访问该域名默认指向该服务器的80（http）、443（https）端口。 

## 证书

https 是基于 TLS/SSL 的安全套接字上的应用协议，除了传输层进行了加密外，与其它常规HTTP协议一样基本保持一致
证书是 TLS 协议中用来对身份进行验证的机制，是一种签名形式的文件，包含证书拥有者的公钥及第三方证书的信息。  
  
如果希望支持 https 请求，需要申请域名对应的证书，阿里云内可以为购买的域名申请免费的证书。  
  
![/img/node-https/3.jpg](/img/node-https/3.jpg)  

申请完成后下载到本地，待后面使用。

![/img/node-https/6.jpg](/img/node-https/6.jpg)  


## nginx

本人购买的服务器使用的是 debian 系统，ssh 连接服务器  

![/img/node-https/4.jpg](/img/node-https/4.jpg)  

nginx 安装参见 [地址](http://ourjs.com/detail/5834f6716345657c15b8db95)  
  
安装完成后将域名证书上传至服务器 nginx 目录下 cert 文件夹下  
  
![/img/node-https/5.jpg](/img/node-https/5.jpg)  

修改 nginx 服务器配置文件，这里使用了nano编辑器，如何没有安装可以使用 `apt-get install nano` 安装，或者使用你喜欢的 vim 编辑器。

``` bash
nano /etc/nginx/nginx.conf
```
nginx 配置如下

```
server {
    listen 443;
    server_name www.xxx.com; # 域名地址
    ssl on;
    ssl_certificate   cert/1532848318807.pem;
    ssl_certificate_key  cert/1532848318807.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    location / {
        proxy_pass http://127.0.0.1:7001;  # 当前 node 服务的地址
    }
}

```

保存后重启 nginx。


ps: 域名成功访问的前提 node 服务是正常。
