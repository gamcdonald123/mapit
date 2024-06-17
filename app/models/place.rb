class Place < ApplicationRecord
  belongs_to :user
  has_many :list_places
  has_many :lists, through: :list_places
end
