class ListsController < ApplicationController
  # before_action :authenticate_user!

  def index
    @lists = current_user.lists
    render json: @lists
  end

  def create
    @list = current_user.lists.new(list_params)
    if @list.save
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  private

  def list_params
    params.require(:list).permit(:name)
  end
end
