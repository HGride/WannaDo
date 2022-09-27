<script>
import axios from 'axios'

export default{
    data: () => ({
        formSate: "log"
    }),
    
    methods: {
        swpToLog(){
            this.formSate = "log"
        },
        swpToReg(){
            this.formSate = "reg"
        }
    }
}
</script>

<template>
    <div class="login-form">
        <div class="wraper">
            <h2 class="title">
                <span @click="swpToLog">Login</span> or <span @click="swpToReg">register</span>
            </h2>
            <hr>
        </div>
        <div class="wraper">
            <div class="input-wraper" v-if="formSate == 'reg'">
                <label for="name">Name</label>
                <input type="text" name="name" placeholder="Name">
            </div>
            <div class="input-wraper">
                <label for="email">Email</label>
                <input type="text" name="email" placeholder="exemple@mail.com">
            </div>
            <div class="input-wraper">
                <label for="email">Password</label>
                <input type="text" name="email" placeholder="Exemple123!">
            </div>        
        </div>
        <button class="cta">Register !</button>
    </div>
</template>

<style scoped>
    .login-form{
        min-height: min(40rem, 63vh);
        width: min(27rem, 80vw) ;
        border: var(--color-text) solid 2px;
        border-radius: 2rem;
        padding: 1rem 2rem 2rem;
        margin: 2rem auto;
        display: grid;
        grid-template-rows: auto 1fr auto;
        place-items: flex-start center;
    }

    .wraper{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .input-wraper{
        margin: 1rem 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }
</style>