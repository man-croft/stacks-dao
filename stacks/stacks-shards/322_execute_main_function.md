# Execute main function
main
```

{% endcode %}

#### How to Use <a href="#how-to-use" id="how-to-use"></a>

1. **Edit the variables** at the top of the script for your setup
2. **Make it executable**: `chmod +x snapshot.sh`
3. **Run it**: `./snapshot.sh`
4. **Schedule it with cron** for daily backups:

   ```
   # Daily snapshot at 2 AM
   0 2 * * * /path/to/snapshot.sh
   ```

#### What You Need

* AWS CLI set up with the right permissions
* `pzstd` installed (comes with the zstd package)


