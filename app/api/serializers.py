from rest_framework import serializers
from .models import User, Role, Farmer, Buyer, Catalogue, Warehouse, Mill, CoffeeStatus, Coffee


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    role = serializers.StringRelatedField(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        source="role",
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phonenumber",
            "address",
            "role",
            "role_id",
            "password",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = [
            "id",
            "code",
            "name",
            "mark",
            "address",
            "phonenumber",
            "email",
            "county",
            "town",
            "bank",
            "branch",
            "account",
            "currency",
        ]


class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = ["id", "name", "contact_info"]


class CatalogueSerializer(serializers.ModelSerializer):
    buyer = serializers.StringRelatedField(read_only=True)
    buyer_id = serializers.PrimaryKeyRelatedField(
        queryset=Buyer.objects.all(),
        source="buyer",
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Catalogue
        fields = [
            "id",
            "lot",
            "certificate",
            "price",
            "buyer",
            "buyer_id",
            "created_at",
            "updated_at",
        ]


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ["id", "name", "full_name"]


class MillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mill
        fields = ["id", "name", "full_name"]


class CoffeeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoffeeStatus
        fields = ["id", "name", "description"]


class CoffeeSerializer(serializers.ModelSerializer):
    # Read-only nested farmer object for API output
    farmer = FarmerSerializer(read_only=True)

    # Preferred write field
    farmer_id = serializers.PrimaryKeyRelatedField(
        queryset=Farmer.objects.all(),
        source="farmer",
        write_only=True,
        required=False,
        allow_null=True
    )

    # Backward compatibility for old payloads: {"code": "GR001"}
    code = serializers.SlugRelatedField(
        slug_field="code",
        queryset=Farmer.objects.all(),
        source="farmer",  # points to actual FK
        write_only=True,
        required=False,
        allow_null=True
    )

    # Status
    status = serializers.StringRelatedField(read_only=True)
    status_id = serializers.PrimaryKeyRelatedField(
        queryset=CoffeeStatus.objects.all(),
        source="status",
        write_only=True,
        required=False,
        allow_null=True
    )

    # Mill
    mill = serializers.StringRelatedField(read_only=True)
    mill_id = serializers.PrimaryKeyRelatedField(
        queryset=Mill.objects.all(),
        source="mill",
        write_only=True,
        required=False,
        allow_null=True
    )

    # Warehouse
    warehouse = serializers.StringRelatedField(read_only=True)
    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(),
        source="warehouse",
        write_only=True,
        required=False,
        allow_null=True
    )

    # Catalogue
    catalogue = serializers.StringRelatedField(read_only=True)
    catalogue_id = serializers.PrimaryKeyRelatedField(
        queryset=Catalogue.objects.all(),
        source="catalogue",
        write_only=True,
        required=False,
        allow_null=True
    )

    # Created by
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Coffee
        fields = "__all__"
        extra_kwargs = {
            "farmer": {"read_only": True},
            "status": {"read_only": True},
            "mill": {"read_only": True},
            "warehouse": {"read_only": True},
            "catalogue": {"read_only": True},
            "created_by": {"read_only": True},

            "lot": {"required": False, "allow_blank": True},
            "outturn": {"required": False, "allow_blank": True},
            "parchment_outturn": {"required": False, "allow_blank": True},
            "clean_outturn": {"required": False, "allow_blank": True},
            "type": {"required": False, "allow_blank": True, "allow_null": True},
            "grade": {"required": False, "allow_blank": True},
            "sale": {"required": False, "allow_blank": True, "allow_null": True},
            "season": {"required": False, "allow_blank": True},
            "certificate": {"required": False, "allow_blank": True, "allow_null": True},
            "catalogue_type": {"required": False, "allow_blank": True, "allow_null": True},
            "buyer": {"required": False, "allow_blank": True, "allow_null": True},
            "remarks": {"required": False, "allow_blank": True, "allow_null": True},
            "file": {"required": False, "allow_blank": True},

            "bags": {"required": False},
            "pockets": {"required": False},
            "weight": {"required": False},
            "milling_charges": {"required": False},
            "warehouse_charges": {"required": False},
            "brokerage_charges": {"required": False},
            "export_charges": {"required": False},
            "transport_charges": {"required": False},
            "price": {"required": False},
            "net_value": {"required": False},
            "gross_value": {"required": False},
            "reserve": {"required": False},
        }

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        return Coffee.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def get_farmer(self, obj):
        if obj.farmer:
            return {
                "name": obj.farmer.name,
                "mark": obj.farmer.mark,
                "county": obj.farmer.county,
            }
        return None