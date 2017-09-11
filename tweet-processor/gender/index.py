'''
  tweet-processer/gender/index.py

  Python script that updates takes a tweet at stdin
  and returns a 'gendered' tweet
  Spawned from tweet-processer/gender/index.js
'''
import json, os, sys
# Import and initialise GenderComputer
from genderComputer.genderComputer import GenderComputer
gc = GenderComputer(os.path.join(os.path.dirname(__file__), './genderComputer/nameLists'))

def resolve_gender_from_user(user):
  # Defaults location to USA until we can sort better country parsing
  gender = gc.resolveGender(user[u'name'], 'USA')
  # Have two goes at getting a sensible name
  if gender == None or gender == 'unisex':
    gender = gc.resolveGender(user[u'screen_name'], 'USA')
  # Encode gender numerically to ease indexing
  if gender == 'male':
    gender = 0
  elif gender == 'female':
    gender = 1
  else:
    gender = -1
  return gender

def gender_names(tweet):
  tweet[u'sender'][u'gender'] = resolve_gender_from_user(tweet[u'sender'])
  for recipient in tweet[u'recipients']:
    recipient[u'gender'] = resolve_gender_from_user(recipient)
  return tweet

if __name__ == '__main__':
  # Basic event loop--blocks on input from stdin
  while True:
    tweet = sys.stdin.readline()
    if tweet == 'end':
      break
    print(json.dumps(gender_names(json.loads(tweet))))
