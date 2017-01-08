import * as service from '../services/family'
import family from '../assets/family.json'

export default {
  namespace: 'family',
  state: {
    common: {},
    data: []
  },
  reducers: {
    save(state, {payload: {common,data}}) {
//       return {...state, common, data}
      return {...state, ...family}
    }
  },
  effects: {
    *fetch({payload}, {call, put}) {
      const {data} = yield call(service.fetch)
      yield put({
        type: 'save',
        payload: {common: data.common, data: data.data}
      })
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if(pathname === '/') {
          dispatch({type: 'fetch', payload: query})
        }
      })
    }
  },
}
