Rails.application.routes.draw do
  root to: "champion#index"

  get 'contact-us', to: 'feedback#new', as: :feedbacks
  post 'contact-us', to: 'feedback#create'

  get 'thanks', to: 'donation#thanks', as: :donation_thanks

  get 'admin/', to: 'admin#index', as: :admin_index
  post 'admin/', to: 'admin#start_stop_polling', as: :start_stop_polling
  put 'admin/', to: 'admin#reset_index', as: :reset_index
  delete 'admin/', to: 'admin#change_region', as: :change_region

  get '/', to: 'champion#index', as: :champion_index
  get '/overall', to: 'champion#overall', as: :overall
  get '/:id', to: 'champion#show', as: :champion_show

  get 'error/mysql'
end
