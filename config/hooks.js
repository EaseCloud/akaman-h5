export default {
  action_get_model_edit_route (model, pk) {
    return { path: `/main/${model}/${pk}` }
  },
  action_get_model_list_route (model) {
    return { path: `/main/${model}` }
  }
}
