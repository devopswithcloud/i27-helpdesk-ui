apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: i27helpdesk-ui
  namespace: i27helpdesk-prod
  annotations: 
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec: 
  ingressClassName: nginx 
  tls:
  - hosts:
    - prod.i27helpdesk.in
    - i27helpdesk.in
    secretName: i27helpdesk-ui-tls
  rules:
  - host: prod.i27helpdesk.in
    http:
      paths:
      - path: /
        pathType: Prefix
        backend: 
          service:
            name: i27-ui-clusterip
            port: 
              number: 80
  - host: i27helpdesk.in
    http:
      paths:
      - path: /
        pathType: Prefix
        backend: 
          service:
            name: i27-ui-clusterip
            port: 
              number: 80

#               kubectl create secrert tls 