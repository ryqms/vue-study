// 实现一个插件
// 实现store
let Vue;
class Store {
  constructor(options) {
    // 响应式处理的数据
    // this.state = new Vue({
    //   data: options.state
    // })
    // setInterval(() => {
    //   this.state.counter++
    // },1000)
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._getters = options.getters;


    // 定义computed选项
    const computed = {}
    this.getters = {}
    const that = this
    Object.keys(this._getters).forEach(key => {
      // 获取用户定义的getter
      const fn = that._getters[key]
      // 转换为computed可以使用的无参数形式
      computed[key] = function () {
        return fn(that.state)
      }
      // 为getters定义只读属性
      Object.defineProperty(that.getters, key, {
        get:()=> that._vm[key]
      })
    })

    this._vm = new Vue({
      data: {
        // 添加两个$$ vue就不会代理
        $$state: options.state,
      },
      computed
    });

    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);


  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error("清使用replaceState重置状态");
  }

  // 修改状态 commit('add',参数)
  commit(type, payload) {
    // 1。根据type获取mutation
    const mutation = this._mutations[type];

    if (!mutation) {
      console.error("mutation不存在");
      return;
    }
    mutation(this.state, payload);
  }

  // 修改状态 dispatch('add',参数)
  dispatch(type, payload) {
    const action = this._actions[type];
    
    if (!action) {
      console.error("mutation不存在");
      return;
    }

    action(this,payload)

  }
}
function install(_Vue) {
  Vue = _Vue
  // 注册$store
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  })
}

// 现在导出的就是Vuex
export default {Store,install}