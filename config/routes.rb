Rails.application.routes.draw do
  devise_for :users
  root 'maps#index'
  resources :places, only: [:index, :create]
  resources :lists, only: [:index, :create]
end
