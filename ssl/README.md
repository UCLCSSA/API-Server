# Generating Development SSL Certificate

[Let's Encrypt](https://letsencrypt.org/docs/certificates-for-localhost/) can be used to generate local development SSL certificates.

## Generate Private Key and Self-signed Certificate for localhost

```bash
openssl req -x509 -out ssl/public-certificate.crt -keyout ssl/private-key.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

## Location and Naming

The private key and public certificate are assumed to have the path:

- Public certificate: `ssl/public-certificate.crt`
- Private key: `ssl/private-key.key`

The path and/or naming can be changed in `src/main.ts`.
