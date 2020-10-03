<template>
    <div>
        <h1 ref="myref"> this is our hooks</h1>
        <p>My name is {{name}}</p>
    </div>
</template>

<script>
export default {
    data(){
        return {
            name: 'Imon Abdullah'
        }
    },
    beforeCreate(){
        console.log(this.name)
    },
    created(){
        //call mostily initial data form it
        console.log('data and other functions are available but not html', this.name)
    },
    mounted(){
        console.log(this.$refs.myref);
    }
}
</script>

