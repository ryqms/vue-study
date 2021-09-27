export default {


  // 当响应式数据改变的时候，所有使用响应式数据的组件都会重新render
  render(h) {
      // 标记当前router-view的深度
    this.$vnode.data.routerView = true;

    let depth = 0
    let parent = this.$parent

    while (parent) {
      const vnodeData = parent.$vnode && parent.$vnode.data
      if (vnodeData) {
        if (vnodeData.routerView) {
          // 说明当前的parent是一个router-view
          depth++;
        }
      }

      parent = parent.$parent;
    }



    // url => component
    let component = null;
    // const { current, options } = this.$router;

    // console.log(this.$router);

    const route = this.$router.matched[depth]
    if (route) {
      component = route.component;
    }

    // console.log(current, options);
    return h(component);
  }
}