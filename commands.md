# Curl-like app

- Get command
./httpc.exe get http://httpbin.org/get

- Post command
./httpc.exe post http://httpbin.org/post

- Verbose
./httpc.exe get -v http://httpbin.org/get
./httpc.exe post -v http://httpbin.org/post

- Header
./httpc.exe get -h Foo:Bar http://httpbin.org/get
./httpc.exe post -h Foo:Bar http://httpbin.org/post

- Inline
./httpc.exe post -d '{\"foo\": \"bar\"}' http://httpbin.org/post

- File
./httpc.exe post -f './file.json' http://httpbin.org/post

# Optional Tasks

- Support redirect (Using httpbingo, because httpbin returns a 404 for redirects)
./httpc.exe get -v http://httpbingo.org/redirect/5

- Supports -o option
./httpc.exe get -o out.txt http://httpbin.org/get
./httpc.exe post -o out.txt http://httpbin.org/post