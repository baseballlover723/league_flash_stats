# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150926003751) do

  create_table "champions", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.string   "title",       limit: 255
    t.string   "img",         limit: 255
    t.string   "splash_img",  limit: 255
    t.string   "loading_img", limit: 255
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "feedbacks", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "from_email", limit: 255
    t.string   "message",    limit: 255
    t.string   "spam",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "last_match_indices", force: :cascade do |t|
    t.integer  "index",      limit: 4
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  create_table "ranks", force: :cascade do |t|
    t.string   "lane",        limit: 255
    t.string   "rank",        limit: 255
    t.integer  "wins",        limit: 4
    t.integer  "losses",      limit: 4
    t.boolean  "has_flash"
    t.boolean  "flash_on_f"
    t.integer  "champion_id", limit: 4
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "ranks", ["champion_id"], name: "index_ranks_on_champion_id", using: :btree

  create_table "regions", force: :cascade do |t|
    t.string   "region",     limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

end
