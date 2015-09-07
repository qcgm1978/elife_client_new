 * modularize in room page
    * logic: 
        * model: [7 modules](http://journal.crushlovely.com/post/88286835473/7-patterns-to-refactor-javascript-applications)
        * view
        * controller
    * library: requirejs       
    * performance: 
        * Research by devtools and pagespeed
        * [taobao](http://www.rshining.net/archives/941)
 * build
     * handling the existing code
         ```
         grunt build:formal
         ```
     * generate a complete code dir
         ```
         grunt build:uumie
         ```
     * autoprefixer