#!/bin/bash

for((i=1;i<=1000;i++));  
do   
echo '{"_index":"occikb","_type":"OCCI","_id":"ALM-100001'$i'","_score":0,"_source":{"id":"ALM-100001'$i'","type":"OCCI","description":"Logstash服务或代理不可用","explanation":"系统每60秒周期性检测Logstash服务状态，当检测到Logstash服务不可用时产生该告警。","level":"WARN","impact":"无法收集OCCI日志和实时分析数据。","reasons_steps":[{"reason":"Logstash服务异常。","steps":["登录橘云Ambari页面，在Ambari首页，单击OCCI Service。","查看Logstash服务是否正常。 是，执行步骤5。  否，执行步骤3。","单击Logstash Agent链接。找到Logstash Agent异常主机，单机主机链接。","在主机组件页面重新启动或启动Logstash Agent，等待Logstash Agent启动成功，等待一分钟，告警消失。","收集所有节点Logstash日志，发送给运维人员处理"]}],"reference":""}}' >> xxx.json;
done  


