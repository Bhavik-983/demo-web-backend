Demo Web Backend

GitHub Repository
https://github.com/Bhavik-983/demo-web-backend

Run the Application
npm run dev



Environment Variables

Create a .env file in the root directory and add the following:

MONGO_URI=mongodb://localhost:27017/task

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin@123

AUTH_SECRET=lgntknsecret222



Database Seeder

By default, the application creates:
5 Users
5 Managers
A seeder is implemented for this purpose.

Seeder Location:
src/seeders/users.js


API Endpoints

AUTH
1.login api 
  method POST
  endpoint api/auth/login
  
2.get profile api
  method GET
  endpoint api/auth/profile

3.update profile api
  method PUT
  endpoint api/auth/update-profile


ADMIN

1.create user api
  method POST
  endpoint api/admin/create-user

2.get user list api
  method GET
  endpoint api/admin/user-list

3.update user api
  method PUT
  endpoint api/admin/update-user/:userId

4.delete user api
  method DELETE
  endpoint api/admin/delete-user/:userId


MANAGER

1.get user list api
  method GET
  endpoint api/manager/user-list

2.update user api
  method PUT
  endpoint api/manager/update-user/:userId






<!-- deploy node on aws ec2 -->

1. go to the ec2 instance and launch it
  step 1: enter the name of server, select applciation and os images , create key pair after creating click om launch

  step 2: connect your instance go to  SSH client
   chmod 400 "node-key.pem" run this command when you download your keypair file i need to run this command for permission

   then run ssh -i "node-key.pem" ubuntu@ec2-13-201-129-207.ap-south-1.compute.amazonaws.com this command for completely connection and reconnection


now get default linux packages update  & upgrade the packages on EC2 instance
  step 3:  (sudo apt update && sudo apt upgrade -y)

 Install nodejs and npm on your EC2 instance
  step 4 : sudo apt-get install npm -y
           sudo npm i -g n
           sudo n lts (for new version)


  Now Install the Nginx server on your EC2 instance

  step 5 : sudo apt install nginx -y 

  step 6 : sudo systemctl enable nginx
           sudo systemctl start nginx


  step 7 : sudo mkdir -p /var/www/appname
           cd /var/www/appname


 step 8 : sudo git clone yourrepo(https://github.com/Bhavik-983/demo-web-backend.git) .
          sudo npm i


 step 9 : sudo nano /etc/nginx/sites-available/node-app(app name) 

   server {
      listen 80;
      server_name 13.201.129.207;

      location / {
          proxy_pass http://localhost:8000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_cache_bypass $http_upgrade;


          # Timeout settings
          proxy_connect_timeout 60s;
          proxy_send_timeout 60s;
          proxy_read_timeout 60s;
      }

   }

   step 10 : sudo ln -s /etc/nginx/sites-available/node-app(app name) /etc/nginx/sites-enabled (for enable the site, read our created file by nginx)

   step 11: sudo rm /etc/nginx/sites-enabled/default

   step 12: sudo nginx -t (for test the nginx configuration)

   step 13: sudo systemctl restart nginx

   step 14: gotint to the app directory and run the app
   cd /var/www/appname
   npm run dev

   step 15 : sudo npm install -g pm2 (for production mode for restart the server )

   step 16 : sudo pm2 startup (when restart ubuntu so automatically pm2 will restart)

   step 17 : sudo pm2 start app.js (for start the server) if your code is not in plain js so first of create build and create ecosystem.config.js file and then run this command

   step 18 : sudo pm2 save (for save the server)

   step 19 : pm2 list or pm2 status (for list the server)



   frontend

   step 1 : create /var/www/frontend
  
   step 2 : create build of your frontend in local

   step 3 :scp -i node-key.pem -r dist ubuntu@13.201.129.207:/var/www/frontend/ (store created build on ec2)

   sudo nano /etc/nginx/sites-available/node-app
   then set

   server {
      listen 80;
      server_name 13.201.129.207;

      # FRONTEND (Vite build)
      root /var/www/frontend/dist;
      index index.html;

      location / {
            try_files $uri $uri/ /index.html;
       }

      location /api {
          proxy_pass http://localhost:8000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_cache_bypass $http_upgrade;


          # Timeout settings
          proxy_connect_timeout 60s;
          proxy_send_timeout 60s;
          proxy_read_timeout 60s;
      }

    }

    CI-CD 

    step 1 : open your repository and going to the setting -> security -> secrets and variables -> actions

    step 2 : New repository secrets
     add secrets for establis connection
     EC2_HOST = ubuntu (os name)
     EC2_USERNAME = 13.201.129.207 (public ip of ec2 instance)
     EC2_SSH_KEY = ssh key which is downloaded due create instance node-key.pem (open this file and copy that key and paste in secret value)




name: Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.EC2_SSH_KEY }}

      - name: Test SSH
        run: |
          ssh -o StrictHostKeyChecking=no \
          ${{ secrets.EC2_USERNAME }}@${{ secrets.EC2_HOST }} \
          "whoami && hostname"

      - name: Deploy
        run: |
          ssh -o StrictHostKeyChecking=no \
          ${{ secrets.EC2_USERNAME }}@${{ secrets.EC2_HOST }} << 'EOF'
            cd /var/www/node-app
            git pull origin main
            npm install --production
            pm2 restart all
          EOF