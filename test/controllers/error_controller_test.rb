require 'test_helper'

class ErrorControllerTest < ActionController::TestCase
  test "should get mysql" do
    get :mysql
    assert_response :success
  end

end
