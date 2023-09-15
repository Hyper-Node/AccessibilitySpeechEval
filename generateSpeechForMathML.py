# This script generates speech with MathCAT for intent evaluation data.
# It is working only in Windows and by having libmathcat.pyd file (from dll build)
# in the same folder. 

import os

import shutil
if os.path.exists("libmathcat_py.pyd"):
  os.remove("libmathcat_py.pyd")
  shutil.copy("..\target\debug\libmathcat_py.dll", "libmathcat.pyd")

import libmathcat
import json
 
JSON_PATH_INPUT = './eval_data/IntentParserTestLocal-Output.json'
JSON_PATH_OUTPUT = './eval_data/IntentParserTestLocal-Speech.json'

def loadJSONFile(path):
  f = open(path)
  data = json.load(f)
  f.close()
  return data
def writeJSONFILE(path, dictionary):
  # Serializing json
  json_object = json.dumps(dictionary, indent=4)
  
  # Writing to sample.json
  with open(path, "w") as outfile:
      outfile.write(json_object)



data = loadJSONFile(JSON_PATH_INPUT);

def SetMathCATPreferences():
  try:
    libmathcat.SetRulesDir(
      # this assumes the Rules dir is in the same dir a the library. Modify as needed
      os.path.join( os.path.dirname(os.path.abspath(__file__)), "Rules")
    )
  except Exception as e:
    print("problem with finding the MathCAT rules")

  try:
    libmathcat.SetPreference("TTS", "none")
    libmathcat.SetPreference("Language", "en")         # Also "id" and "vi"
    libmathcat.SetPreference("SpeechStyle", "SimpleSpeak")   # Also "ClearSpeak"
    libmathcat.SetPreference("Verbosity", "Verbose")   # also terse "Terse"/"Medium"
    libmathcat.SetPreference("CapitalLetters_UseWord", "true")   # if "true", X => "cap x"
  except Exception as e:
      print("problem with setting a preference")

def SetMathMLForMathCAT(mathml: str):
  try:
    libmathcat.SetMathML(mathml)
  except Exception as e:
    print("problem with SetMathML for: " + mathml)
    print("Exception: " + str(e))

def GetSpeech():
  try:
    return libmathcat.GetSpokenText()
  except Exception as e:
    return "problem with getting speech for MathML"

def GetSpeechForMathML(mathml):
  SetMathMLForMathCAT(mathml)
  return GetSpeech()

SetMathCATPreferences()   # you only need to this once
print("Using MathCAT version '{}'".format(libmathcat.GetVersion()))

for entry in data:
  entry["Speech_MathML_texvc"] = GetSpeechForMathML(entry["MathML_texvc"] );
  entry["Speech_MathML_default"] = GetSpeechForMathML(entry["MathML_default"]);
  entry["Speech_MathML_explicit"] = GetSpeechForMathML(entry["MathML_explicit"]);
 

writeJSONFILE(JSON_PATH_OUTPUT, data);

exit()
