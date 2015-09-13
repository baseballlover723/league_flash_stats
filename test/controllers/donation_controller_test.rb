require 'test_helper'

class DonationControllerTest < ActionController::TestCase
  test "should get thanks" do
    get :thanks
    assert_response :success
  end

end
