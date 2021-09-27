import view from './krouter-view'
let Vue

// 实现插件
class VueRouter {
  constructor(options) {
    this.options = options;

    // 数据响应式   current必须是响应式的，这样current变化，使用他的组件就会重新renter
    // 如何造一个响应式数据？
    // 1.借鸡生蛋 => new Vue({data: {current: '/'}})
    // 2. Vue.util.defineReactive(obj,'current','/')

    // Vue.set(
    //   obj,  // 必须是响应式对象
    // )

    // Vue.util.defineReactive(
    //   this,
    //   "current",
    //   window.location.hash.slice(1) || "/"
    // );
    this.current = window.location.hash.slice(1) || "/";
    Vue.util.defineReactive(this, "matched", []);

    // match方法可以递归的遍历路由表，获得匹配关系的数组
    this.match();

    // this.current = window.location.hash.slice(1) || '/'

    // 监控url  hash 变化
    window.addEventListener("hashchange", this.onHashChange.bind(this));
    window.addEventListener("load", this.onHashChange.bind(this));
  }
  onHashChange() {
    console.log(window.location.hash);

    this.current = window.location.hash.slice(1);
    this.matched = []
    this.match()
  }
  match(routes) {
    routes = routes || this.options.routes;
    
    for (const route of routes) {
      if (route.path === "/" && this.current === "/") {
        this.matched.push(route);
        return;
      }
      //
      if (route.path !== "/" && this.current.indexOf(route.path) != -1) {
        this.matched.push(route);
        if (route.children) {
          this.match(route.children);
        }
        return;
      }
    }
  }
}

// 插件要实现一下install 方法     use回调用
VueRouter.install = function (_Vue) {
  Vue = _Vue

  // 注册router实例
  // 通过全局混入 Vue.mixin({beforeCreate})
  Vue.mixin({
    beforeCreate() {
      // 仅在根组件创建时执行一次
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
      
    }
  });
  
  
  // 注册 router-view 和 router-link
  Vue.component("router-view", view);
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render(h) {
      // jsx方式
      // return <a href={`#${this.to}`}>{this.$slots.default}</a>
      // render函数
      return h("a",{attrs: {href: `#${this.to}`}} ,this.$slots.default);
    },
  });
  
}

// 导出
export default VueRouter