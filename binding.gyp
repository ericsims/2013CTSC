{
  "targets": [{ 
      "target_name": "opencv"
      ,  "sources": [ 
          "node_modules/opencv/src/init.cc"
        , "node_modules/opencv/src/Matrix.cc"
        , "node_modules/opencv/src/OpenCV.cc"
        , "node_modules/opencv/src/CascadeClassifierWrap.cc"
        , "node_modules/opencv/src/Contours.cc"
        , "node_modules/opencv/src/Point.cc"
        , "node_modules/opencv/src/VideoCaptureWrap.cc"
        , "node_modules/opencv/src/CamShift.cc"
        , "node_modules/opencv/src/HighGUI.cc"
        , "node_modules/opencv/src/FaceRecognizer.cc"
        ]
      , "conditions": [
         ['OS=="win"', { #windows needs include dirs passed to MSBUILD this way
            'include_dirs': [              
              '<!@(pkg-config --cflags "opencv >= 2.3.1" )'
            ],
          }],
         ['OS=="mac"', {
          # cflags on OS X are stupid and have to be defined like this
          'xcode_settings': {
            'OTHER_CFLAGS': [
              '<!@(pkg-config --cflags opencv)'
            ]
            , "GCC_ENABLE_CPP_RTTI": "YES"
            , "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
          }
        }]              
      ]
      , 'libraries': [
          '<!@(pkg-config --libs opencv)'
        ]
      , 'cflags': [
           '<!@(pkg-config --cflags --libs "opencv >= 2.3.1" )'
          ,'-Wall'
          ]
      , 'cflags!' : [ '-fno-exceptions']
      , 'cflags_cc!': [ '-fno-rtti',  '-fno-exceptions']

  }]
}
