# Resops and JMeter
Done by Brendan Wadey.

TOTP java implementation done by Thorsten Hoeger and Mahsum Urebe, taken from https://github.com/taimos/totp/ under the Apache License 2.0.

## Installation and Use
Prerequesites:
- Java JDK ver. 8 or higher
- User Data CSV (available on request; please contact Brendan Wadey via Discord)

1. Install Apache JMeter ver. 5.5 or higher

    Download: https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.5.zip
   
    Bonus Installation Video: https://www.youtube.com/watch?v=Go92Nj_u7nw
   
3. Locate the ApacheJMeter.jar found in the /bin folder and click to open JMeter
4. In the Test Plan element, under the Library section, ensure there is an instance pointing to the resops/jmeter/libraries/TOTP.jar file.
5. In the two CSV elements, ensure they point towards the .csv files found in resops/jmeter/data/
6. To load data from previous test runs, hit "browse" on the test listeners and select the .jtl files within resops/jmeter/results/

Have any problems? Feel free to ask!
