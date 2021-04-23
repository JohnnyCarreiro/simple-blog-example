# Simple Blog 🔥 🗞

This project was developed to be fast, secure, and easy to scale. For this proposal, JAMStack is the best architecture design of choice. This blog runs without a necessity to be implemented with a back-end and could be deployed on any CND of choice. For small and large applications, If a back-end becomes more necessary, it can be easily integrated into the project. Keeping on front-end small responsibilities as login authentication, subscription services using third-party APIs, leaving the back-end with more complex responsibilities.

For active the JAMStack proposal Server Side Rendering and Static Site Generation was the main concept behind this study. So I decided to use Next Js, an excellent React framework. This way keeping authentication protected by a "back-end" could be possible. And the other services I'm using for subscriptions and payments, Stripe, and content management systems, Prismic, was chosen by their good documentation and easy integrations. And also running on protected routes aside from the client-side.

Now for control who is subscribed to any services, in this case just one service, a database made necessary to store the customer email from his Github login, or any other Social Login, get his id on Stripe callback and add to a subscription database these data. How it is simple, the logic is running in the front-end application, but in a server-side service, protected from the client and the connection to the database is using FaunaDb services. What makes the process more reliable and fast, another database as a service of my interest is Supabse. For developing small and medium projects all these technologies could feat very well.

🌐 Check it out [here]();

### ⚙️ In this project:

- Integrations and libraries
    - Stripe api for subscriptions and payments;
    - Prismic - Content management service ;
    - Fauna DB - Database as a service;
    - NextAuth - Social authentication;

## **📝 License**

This project is licensed under the MIT License - see the [LICENSE.md]() file for more information.

---

Made with ♥ by Johnny Carreiro
