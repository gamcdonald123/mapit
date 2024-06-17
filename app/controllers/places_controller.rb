class PlacesController < ApplicationController
  before_action :authenticate_user!

  def index
    @places = current_user.places
    render json: @places
  end

  def create
    @place = current_user.places.new(place_params)
    if @place.save
      render json: @place, status: :created
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  private

  def place_params
    params.require(:place).permit(:name, :latitude, :longitude)
  end
end
