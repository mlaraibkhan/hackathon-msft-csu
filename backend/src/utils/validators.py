"""Input validation utilities."""
import re
import ipaddress


def validate_ipv4(address: str) -> bool:
    """Validate IPv4 address format."""
    try:
        ipaddress.IPv4Address(address)
        return True
    except ValueError:
        return False


def validate_hostname(hostname: str) -> bool:
    """Validate hostname format."""
    if len(hostname) > 255:
        return False
    if hostname[-1] == ".":
        hostname = hostname[:-1]
    allowed = re.compile(r"(?!-)[A-Z\d-]{1,63}(?<!-)$", re.IGNORECASE)
    return all(allowed.match(x) for x in hostname.split("."))


def is_rfc1918(address: str) -> bool:
    """Check if IP address is in RFC1918 private range."""
    try:
        ip = ipaddress.IPv4Address(address)
        return ip.is_private
    except ValueError:
        return False


def validate_target(target: str) -> tuple[bool, str, bool]:
    """
    Validate target address.
    
    Returns:
        tuple: (is_valid, normalized_address, is_private)
    """
    target = target.strip()
    
    # Try IPv4
    if validate_ipv4(target):
        return True, target, is_rfc1918(target)
    
    # Try hostname
    if validate_hostname(target):
        return True, target, False
    
    return False, "", False


def validate_port(port: int) -> bool:
    """Validate port number."""
    return 1 <= port <= 65535
