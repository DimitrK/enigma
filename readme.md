
----
## Enigma JS
An encryption and encoding JavaScript library for [Enyo](https://github.com/enyojs/enyo) JS

***

### **Description**

Enigma is a JavaScript library that provides encryption and encoding methods meant to be used with Enyo; a JavaScript framework focused mostly on development of mobile and tablet applications. It came to life out of my need to use some encryption in data for communication between the Enyo mobile client application and the web services I am developing and is heavily based in work of others (see the end of file).

The functionalities provided in this library are categorized as:

* **Encoding:**
    * Base 64
    * Hex
    * Custom ( *Given a string representation of possible characters as second arguments. Usefull for random strings generation*)
    * UTF - 8
    * Little and Big Endian arrays
* **Encryption algorithms:**
    * MD5 _(RFC 1321)_
    * SHA256 _(FIPS 180-2)_
    * SHA512 _(FIPS 180-2)_
    * RIPEMD160
* **HMAC** _(FIPS 198)_ implementations for all the above Enctyption/Hashing algorithms




### **Integrating the library**

If you are using [Enyo Bootplate](https://github.com/enyojs/enyo/wiki/Bootplate), as with any usual Enyo library just copy the `enigma` folder to the project's `lib` directory and update the `package.js` file to point to the `enigma` folder as well.
In case you based your project in a different directory structure, include it wherever you see appropriate and make sure to update the nearest `package.js` file with the relative location of `enigma` folder.


```javascript
    // Adding the new dependency
    enyo.depends(
        "$lib/enigma",
        .
        .
        "$lib/layout"
    );

```


### **Using Enigma**
Enigma is composed mainly out of static functions so you can call it whenever needed inside the code whithout the need to instanciate it or to include it prior to the plugin.

* In order to encode a string :
```javascript
    var aString , b64String;
    aString = "This is a string";
    b64String = enigma.encode.toBase64(aString); //VGhpcyBpcyBhIHN0cmluZw==
```
Available encoding methods:
 * `enigma.encode.toBase64`
 * `enigma.encode.toHex`
 * `enigma.encode.toCustom`
 * `enigma.encode.toUtf8`
 * `enigma.encode.toBigEndians`
 * `enigma.encode.toLittleEndians`

* In order to encrypt a string:
```javascript
    var anImportantString , sha512Hash;
    anImportantString = "password";
    sha512Hash = enigma.sha512.hash(anImportantString);
```
The available encryption methods are:
 * `enigma.sha512`
 * `enigma.sha256`
 * `enigma.rmd160`
 * `enigma.md5`

 The trailing `.hash()` method exists behind every available encryption and it return an instance of`Hash` which has as properties all the available encoding methods that exist in `enigma.encode` . So if you would like to get the Hex or the Base64 value of the generated value is enough to call `sha512Hash.toHex()` or `sha512Hash.toBase64()` or any other encoding you would like. The available encodings are the same with the ones in `enigma.encode` .


* In order to generate an HMAC from a string and some data (any kind) :
```javascript
    var anImportantString, someData , sha512HmacHash;
    anImportantString = "password";
    someData = {message: "hi"}
    sha512HmacHash = enigma.sha512.hmac(anImportantString, someData); // enyo.instance {....,
```
For every encoding along with the `.hash()` method mentioned before, there is the corresponding `.hmac()` as well. The `.hmac()` returns also an object which is an instance of `Hash` so the encodings are present here as well anc can be invoked in the same manner demonstrated above.


### **Configuring Enigma**

There are two configuration options used for Hexadecimal and Base64 encodings.

* **For Hex encoding** you can define if the output should be with upper-case letters or not by setting the corresponding flag to true or false (1 or 0) as follows:
```javascript
enigma.config.setHexCase(1);
```
This setting interpretates each argument as trully or falsy and sets always 0 or 1 as value. The default value is 0 (lower-case letters )


 * **For Base64** encoding you can define chich character will be used as padding character whenever this is necessary and can be defined as follows:
```javascript
enigma.config.setBase64Pad("=");
```
This setting at all cases can take only one character or an empty string. The default value is "=" as described to the specification.



Keep in mind that if the configurations change during program execution, every encoding that will be called later on even on hashes generated prior to that change, the new configuration will apply.


Author: [DimitrK](http://dimitrisk.info)

The library is based **havily** on the work of other people that must be aknowledged. Those are: [Paul Johnston](http://pajhome.org.uk/), [Jeremy Lin](http://www.ocf.berkeley.edu/~jjlin/jsotp/), Greg Holt, Andrew Kepert, Ydnar, Lostinet

License: [BSD License](http://pajhome.org.uk/site/legal.html#bsdlicense)
