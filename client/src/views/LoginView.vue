<script>
  import LoginForm from '../components/LoginForm.vue';

 export default {
  components: {
    LoginForm
  }
 }
</script>

<template>
  <main>
    <section class="heading">
      <h1 class="heading-title">Hi,</h1>
      <h2 class="title">Welcome on WannaDo !</h2>
      <p class="text">
        WannaDo is the most effective to-do list for anyone who wants to plan their days.
      </p>
    </section>
    <section class="login-form">
      <LoginForm />
    </section>
  </main>
</template>

<style scoped>
  main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    gap: .5rem;
  }

  @media screen and (min-width: 900px){
    main{
      align-items: flex-start;
      flex-direction: row;
      gap: 3rem;
    }

    p{
      width: 30vw;
    }
  }
</style>
