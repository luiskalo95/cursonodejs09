from locust import TaskSet, HttpLocust, task
import json

class UserBehaviour_A(TaskSet):
    def on_start(self):
        response = self.client.post("/auth/login", {"email": "luis1995sep24@hotmail.com","password": "123456"})
        print(response)
        self.accessToken=response.json()['payload']['data']['accessToken']

    @task(3)
    def list_users(self):
        self.client.get("/users",headers={"Authorization":  "Bearer {}".format(self.accessToken)})

    @task(1)
    def list_one_user(self):
        self.client.get("/users/3",headers={"Authorization":  "Bearer {}".format(self.accessToken)})

class UserBehaviour_B(TaskSet):
    def on_start(self):
        response = self.client.post("/auth/login", {"email": "luis1995sep24@hotmail.com","password": "123456"})
        print(response)
        self.accessToken=response.json()['payload']['data']['accessToken']

    @task(5)
    def list_users(self):
        self.client.get("/users",headers={"Authorization":  "Bearer {}".format(self.accessToken)})

    @task(7)
    def list_one_user(self):
        self.client.get("/users/4",headers={"Authorization":  "Bearer {}".format(self.accessToken)})

class Test_A(HttpLocust):
    task_set = UserBehaviour_A
    min_wait = 2000
    max_wait = 5000

class Test_B(HttpLocust):
    task_set = UserBehaviour_B
    min_wait = 4000
    max_wait = 6000