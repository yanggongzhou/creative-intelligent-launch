
const state = {
  timeRecord:'',//当前预览动画的开始时间节点
  alreadyPlayTime:0,//当前预览动画已播放的时间
}

//获取数据 getters
const getters = {
  TimeRecord      : state => state.timeRecord,
  AlreadyPlayTime : state => state.alreadyPlayTime,
}
const mutations = {
  update_TimeRecord (state, data) {
    state.timeRecord =  data ? data  : false;
  },
  update_AlreadyPlayTime (state, data) {
    state.alreadyPlayTime =  data ? data  : false;
  },
}



const actions = {
  async handle_exportAllMaterialsMsg({ state, rootState, commit }) {

    // console.log('handle_exportAllMaterialsMsg: ', state, rootState);

    if(state.allMaterialsMsg.length==0) return;

    let _cw = rootState.size.canvas.width,
      _ch = rootState.size.canvas.height,
      _asp = rootState.size.canvasAspect,
      _data = Object.assign({}, rootState.works.animData);
    _data.time = rootState.timeline.toolTotalTime * 1000;
    _data.name = rootState.works.worksName;
    _data.scene_width = _asp.split(':')[0];
    _data.scene_height = _asp.split(':')[1];

    // 处理param
    let items = JSON.parse(JSON.stringify(state.allMaterialsMsg));
    items.forEach((item, idx) => {
      item.width = handleNum2Perc(item.width, _cw);
      item.height = handleNum2Perc(item.height, _ch);
      item.pos.x = handleNum2Perc(item.pos.x, _cw);
      item.pos.y = handleNum2Perc(item.pos.y, _ch);

      state.replaceMaterials.push({
        id: item.id,
        index: idx,
        isReplaceable: item.isReplaceable==false ? 0 : 1
      });

      if(state.delMaterialProps.length>0) {
        state.delMaterialProps.forEach((props, idx) => {
          if(props in item) delete item[props]
        })
      }

      if(item.animation.length>0) {
        item.animation.forEach((anim, idx) => {

        })
      }

    })
    _data.param = items;
    await commit("export_All_Data", _data);
    // console.log(items);
  },

  async handle_addAnimScript({ commit }, param = {}){
    await requestServices.addAnimScript(param)
      .then(res => {
        commit("update_HandleAnimScriptState", res.return_code==1000)
      })
  },

  async handle_editAnimScript({ commit }, param = {}) {
    await requestServices.editAnimScript(param)
      .then(res => {
        commit("update_HandleAnimScriptState", res.return_code==1000)
      })
  },

  handle_addPathAnim({state, rootState}) {
    console.log(state, rootState);

    let animData = Object.assign({}, rootState.spriteMsg.imageAnimInfo);
    animData.when = state.selectMaterialMsg.startTime;
    animData.duration = animData.when + 1000;
    animData.pos.end.x = state.selectMaterialMsg.pos.x+50;
    animData.pos.end.y = state.selectMaterialMsg.pos.y-50;
    animData.scale.end = 1;
    animData.rotation.end = 0;

    state.selectMaterialMsg.animation.push(animData);
  },
  // 重置数据
  resetState ({state, rootState}) {

    state.allMaterialsMsg = [];
    state.selectMaterialIdx = -1;
    state.selectMaterialMsg = {};
    state.materialOperation = 'add';

    state.delMaterialProps = ['size', 'image_url', 'isReplaceable', 'isShowBaseSetting', 'url', 'format', 'isSettingPathAnim'];
    state.handleAnimScriptState = false;
    state.exportAllData = {};
    state.replaceMaterials = [];

    state.isDragging = false;
    state.isResizing = false;
    state.isRotating = false;

    rootState.initToolMsg.initScriptInfo = {};
    rootState.initToolMsg.initMaterialsMsg = [];
    rootState.initToolMsg.imagesHelp = [];

    rootState.works.worksName = '我的作品';
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
