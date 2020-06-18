<template>
  <div>
    <nuxt />
    <div id="screen-ruler"></div>
  </div>
</template>

<script>
export default {
  mounted () {
    // 精确控制 html 的 fontSize 为 5vw
    let fullWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let $html = document.body.parentElement
    let fontSize = fullWidth / 20
    $html.style.fontSize = `${fontSize}px`
    const $ruler = document.getElementById('screen-ruler')
    const adjustScale = function () {
      const gap = fullWidth - $ruler.offsetWidth
      if (gap < -0.01 || gap > 0.01) {
        fontSize *= 1 + gap / fullWidth
        $html.style.fontSize = `${fontSize}px`
        setTimeout(adjustScale, 10)
      } else {
        $ruler.parentElement.removeChild($ruler)
      }
    }
    adjustScale()
  }
}
</script>

<style scoped>
#screen-ruler {
  position: absolute;
  top: 0;
  left: 0;
  width: 20rem;
  height: 1px;
  background-color: blue;
  border: 0;
  box-sizing: border-box;
  /*opacity: 0;*/
}
</style>
